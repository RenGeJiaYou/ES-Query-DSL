/**
 * 说明：在 case_4 基础上，添加需求
 *「求职者的期望薪资范围优先匹配落在当前职位薪资范围内，
 *  再推荐期望最低信息有在职位薪资范围内」
 *
 * 对应字段 desiredPositions.salary.min
 * 
 * 单测结果分析：
 * 排在前面的有 8000~12000、6000~8000，期望下限落在6~10K间；
 * 排在后面的有 5000~12000、5000~12000 期望薪资上下限均超越了6~10K间；
 * 总体来说符合需求
 * 作者：sjj
 */
POST /sjj-resume-test-2/_search
{
  "_source":["desiredPositions.salary"],
  // "sort": [
  //   {
  //     "desiredPositions.salary.min":"asc"
  //   }
  // ],
	"query": {
		"bool": {
			"must": [
				{
          // 原型需求5/6：level 1：筛选出填写了薪资信息的简历（去除将返回缺失该信息的所有简历）
					"exists": {
						"field": "desiredPositions.salary.min"
					}
				},
				{
          // 原型需求5/6：level 1：筛选出填写了薪资信息的简历（去除将返回缺失该信息的所有简历）
					"exists": {
						"field": "desiredPositions.salary.max"
					}
				}
			],
			"should": [
        {
          "bool": {
            "must": [
              {
                // 原型需求5/6 level2（高优先级）：求职者期望顶薪 ≤ 当前职位顶薪
                "range": {
                  "desiredPositions.salary.max": {
                    "lte": 10000, // 此处应该是当前职位的顶薪
                    "boost": 6
                  }
                }
              },
              {
                // 原型需求5/6 level2（高优先级）：求职者期望底薪 ≥ 当前职位底薪
                "range": {
                  "desiredPositions.salary.min": {
                    "gte": 6000,  //此处应该是当前职位的底薪
                    "boost": 6
                  }
                }
              }
            ]
          }
        },
        {
          "bool": {
            "must": [
              {
                // 原型需求5/6 level2（低优先级）：求职者期望顶薪 ＞ 当前职位顶薪
                "range": {
                  "desiredPositions.salary.max": {
                    "gt": 10000, // 此处应该是当前职位的顶薪
                    "boost": 3
                  }
                }
              },
              {
                // 原型需求5/6 level2（低优先级）：求职者期望底薪 ≥ 当前职位底薪
                "range": {
                  "desiredPositions.salary.min": {
                    "gte": 6000,  //此处应该是当前职位的底薪
                    "boost": 3
                  }
                }
              }
            ]
          }
        }
			],
			"must_not": [
				{
          // 原型需求5/6：level 1：简历中的底薪 不得大于 当前岗位顶薪
					"range": {
						"desiredPositions.salary.min": {
							"gt": 10000
						}
					}
				}
			]
		}
	}
}

// 薪资排序：引入 boosting query 抑制坏结果
POST /sjj-resume-test-2/_search
{
  "_source": [
    "desiredPositions.salary"
  ],
  "query": {
    "bool": {
      "must": [// must 会为匹配到的文档加分，filter 不会为其加分
        {
          "exists": {
            "field": "desiredPositions.salary.min"
          }
        },
        {
          "exists": {
            "field": "desiredPositions.salary.max"
          }
        }
      ],
      "should": [
        {
          "boosting": {
            // 将原有优先匹配和次要匹配嵌入到 positive
            "positive": {
              // 将原有bool 表达式
              // (C1 && C2)||(C1&&C3) 化简为
              // C1 && (C2 || C3)
              // C1: 求职者期望底薪 ≥ 当前职位底薪
              // C2: 求职者期望顶薪 ≤ 当前职位顶薪
              // C3: 求职者期望顶薪 > 当前职位底薪
              "bool": {
                "must": [
                  {
                    // 原型需求5/8 level2（高优先级）：求职者期望底薪 ≥ 当前职位底薪
                    "range": {
                      "desiredPositions.salary.min": {
                        "gte": 6000,
                        "boost": 6
                      }
                    }
                  },
                  {
                    "bool": {
                      "should": [
                        {
                          // 原型需求5/8 level2（高优先级）求职者期望顶薪 ≤ 当前职位底薪
                          "range": {
                            "desiredPositions.salary.max": {
                              "lte": 10000,
                              "boost": 6
                            }
                          }
                        },
                        {
                          // 原型需求5/8 level2（低优先级）求职者期望顶薪 > 当前职位底薪
                          "range": {
                            "desiredPositions.salary.max": {
                              "gt": 10000,
                              "boost": 1
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            // 将不符合的匹配项嵌入到 positive
            "negative": [
              {
                "range": {
                  "desiredPositions.salary.max": {
                    "lt": 4000
                  }
                }
              },
              {
                "range": {
                  "desiredPositions.salary.min": {
                    "gt": 10000
                  }
                }
              }
            ],
            "negative_boost": 0.2
          }
        }
      ]
    }
  },
  "size": 200,
  "explain": true
}