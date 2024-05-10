// 将 02 
POST /sjj-resume-test-2/_search
{
  "_source": [
    "desiredPositions.desiredPositionType.firstLevel",
    "highestEducationHistory.education",
    "desiredPositions.salary",
    "desiredPositions.jobCity.city",
    "seekerUserInfo.initialJobDate",
    "desiredPositions.companyIndustry.industry"
  ],
  "query": {
    "bool": {
      "should": [
        {
          "bool": {
            "must": [
              {
				// 原型需求1/8:求职者填写意向职位与当前职位（类型）的一级类型相符；
                "match": {
                  "desiredPositions.desiredPositionType.firstLevel": {
                    "query": "jobtype5bc468fe501809dc4d1000000",
                    "boost": 10
                  }
                }
              },
              {
				// 原型需求3/8:求职者最高学历为检索条件及以上；
                "terms": {
					// match 是全文检索，以下字符串将经过默认 analyzer 划分为若干 token，可以匹配多个字段，只要有一个字段匹配即可
                    // 本例为检索本科及以上：（本科 硕士 博士）
                  "highestEducationHistory.education.keyword": [
                    "educationBackground09dc4d43e0005",
                    "educationBackground09dc4d43e0006",
                    "educationBackground09dc4d43e0008"
                  ]
                }
              },
              {
				// 原型需求5/8：level 1：筛选出填写了薪资信息的简历（去除将返回缺失该信息的所有简历）
                "exists": {
                  "field": "desiredPositions.salary.min",
				  "boost":6
                }
              },
              {
				// 原型需求5/8：level 1：筛选出填写了薪资信息的简历（去除将返回缺失该信息的所有简历）
                "exists": {
                  "field": "desiredPositions.salary.max",
				  "boost":6
                }
              }
            ]
          }
        },
        {
			// 原型需求2/8: 求职者期望工作的城市与当前职位相符；
          "match": {
            "desiredPositions.jobCity.city": {
              "query": "350100",
              "boost": 10
            }
          }
        },
        {
			// 原型需求4/8 ：不得存在工作经验，即仅校招/应届
          "bool": {
            "must_not": [
              {
                "exists": {
                  "field": "seekerUserInfo.initialJobDate",
				          "boost": 2
                }
              }
            ]
          }
        },
        {
			// 原型需求4/8 ：拥有工作经验，一年以内
          "range": {
            "seekerUserInfo.initialJobDate": {
              "gte": "now-1y/d",
              "lt": "now/d",
              "boost": 2
            }
          }
        },
        {
			// 原型需求4/8 ：拥有工作经验，一年到三年
          "range": {
            "seekerUserInfo.initialJobDate": {
              "gte": "now-3y/d",
              "lt": "now-1y/d",
              "boost": 3
            }
          }
        },
        {
			// 原型需求4/8 ：拥有工作经验，三年到五年	
          "range": {
            "seekerUserInfo.initialJobDate": {
              "gte": "now-5y/d",
              "lt": "now-3y/d",
              "boost": 4
            }
          }
        },
        {
          "bool": {
			// 将原有bool 表达式
			// (C1 && C2)||(C1&&C3) 化简为
			// C1 && (C2 || C3)
			// C1: 求职者期望底薪 ≥ 当前职位底薪
			// C2: 求职者期望顶薪 ≤ 当前职位顶薪
			// C3: 求职者期望顶薪 > 当前职位底薪
            "must": [
              {
                // 原型需求5/8 level2（高优先级）：求职者期望底薪 ≥ 当前职位底薪
                "range": {
                  "desiredPositions.salary.min": {
                    "gte": 6000,// 此处应该是当前职位的底薪
                    "boost": 6
                  }
                }
              },
              {
                "bool": {
                  "should": [
                    {
                      // 原型需求5/8 level2（中优先级）求职者期望顶薪 ≤ 当前职位底薪
                      "range": {
                        "desiredPositions.salary.max": {
                          "lte": 10000,// 此处应该是当前职位的顶薪
                          "boost": 6
                        }
                      }
                    },
                    {
                      // 原型需求5/8 level2（低优先级）求职者期望顶薪 > 当前职位底薪
                      "range": {
                        "desiredPositions.salary.max": {
                          "gt": 10000,// 此处应该是当前职位的顶薪
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
        {
          "range": {
            "desiredPositions.salary.max": {
              "lt": 4000,
              "boost": 0.01
            }
          }
        },
        {
			// 原型需求6/8: 求职者期望工作的行业与当前职位相符；
          "match": {
            "desiredPositions.companyIndustry.industry": {
              "query": "industrytype5bc46fe09dc4d4100004",
              "boost": 4
            }
          }
        },
        {
          "bool": {
            "must_not": [

            ]
          }
        }
      ],
      "must_not": [
        // 注释原因为：太影响返回的条数
		    //   {
			// 	// 原型需求7/8：要求设置为开放的简历才会被推荐
            //     "term": {
            //       "isOpened": false
            //     }
            //   },
        {
          "range": {
            "desiredPositions.salary.max": {
              "lt": 2030
            }
          }
        },
        {
          // 原型需求5/8：level 1：简历中的底薪 不得大于 当前岗位顶薪
          "range": {
            "desiredPositions.salary.min": {
              "gt": 10000
            }
          }
        },
        {
          // 原型需求8/8-1: 测试是否匹配求职者屏蔽公司字段
          "term": {
            "resumeRedundancy.queryRedundancyInfo.iBlockedUnitIdList": ""
          }
        },
        {
          // 原型需求8/8-2: 测试是否匹配招聘者屏蔽求职者字段
          "term": {
            "resumeRedundancy.queryRedundancyInfo.blockedMeRecruiterUserIdList": ""
          }
        },
        {
          // 原型需求8/8-3: 测试是否匹配屏蔽求职者字段
          "term": {
            "resumeRedundancy.queryRedundancyInfo.blockedMeUnitIdList": ""
          }
        }
      ]
    }
  },
  "explain": true
}
