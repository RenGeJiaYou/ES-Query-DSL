/**
 * 说明：在 case_6 基础上，添加需求
 *「求职者的**工作经验**与当前职位工作经验的匹配度；优先完整匹配、接着按职位经验要求逐一递增筛选」
 *
 * 工作经验年限是根据初始工作日期动态计算出来的，
 * 对应 JSON 字段：seekerUserInfo.initialJobDate
 * DSL 逻辑：
 *  - JSON 中不存在该字段，满足「不限、在校/应届」匹配条件
 *  - JSON 中存在该字段，满足「工作经验年限 >= 当前职位要求的工作经验年限」匹配条件
 *
 * 作者：sjj
 */

POST /sjj-resume-test-1/_search
{
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
                },
                  {
                    // 原型需求1/6:求职者填写意向职位与当前职位（类型）的一级类型相符；
                    "match" :{
                      "desiredPositions.desiredPositionType.firstLevel": {
                        "query":"jobtype5bc468fe501809dc4d1000000",
                        "boost":20
                      }
                    }
                  },
                {
                    "terms":{
                        // match 是全文检索，以下字符串将经过默认 analyzer 划分为若干 token，可以匹配多个字段，只要有一个字段匹配即可
                        // 本例为检索本科及以上：（本科 硕士 博士）
                        // 后续在 Java 中维护一个 String 常量数组，用于存储学历的 ID，输入 i,返回数组 [i]~[n-1] 左闭右闭
                        "highestEducationHistory.education.keyword":[
                            "educationBackground09dc4d43e0005",
                            " educationBackground09dc4d43e0006",
                            "educationBackground09dc4d43e0008"
                        ]
                        
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
                                        "boost": 10
                                    }
                                }
                            },
                            {
                                // 原型需求5/6 level2（高优先级）：求职者期望底薪 ≥ 当前职位底薪
                                "range": {
                                    "desiredPositions.salary.min": {
                                        "gte": 6000, //此处应该是当前职位的底薪
                                        "boost": 10
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    // 原型需求5/6 level2（低优先级）：求职者期望顶薪 > 当前职位顶薪
                    "range": {
                        "desiredPositions.salary.max": {
                            "gt": 10000, // 此处应该是当前职位的顶薪
                            "boost": 3
                        }
                    }
                },
                {
                    // 原型需求5/6 level2（低优先级）：求职者期望底薪 < 当前职位底薪
                    "range": {
                        "desiredPositions.salary.min": {
                            "lt": 6000, // 此处应该是当前职位的底薪
                            "boost": 3
                        }
                    }
                },

                //   {
                //     "match":{
                //       "desiredPositions.desiredPositionId":{
                //         "query":"2ca4cd0e8e181243018e1b977fff0034",
                //         "boost":10
                //       }
                //     }
                //   },
                {
                    // 原型需求2/6: 求职者期望工作的城市与当前职位相符；
                    "match" :{
                      "desiredPositions.jobCity.city": {
                        "query":"350100",
                        "boost":8
                      }
                    }
                  },
                //   {
                //     "match" :{
                //       "highestEducationHistory.profession": {
                //         "query":"计算机 软件",
                //         "boost":8
                //       }
                //     }
                //   },
                  {
                    // 原型需求6/6：求职者 期望行业 与当前职位对应公司的行业相符
                    "match" :{
                      "desiredPositions.companyIndustry.industry": {
                        "query":"industrytype5bc46fe09dc4d4100004", 
                        "boost":4
                        }
                    }
                  }
                //  {
                //     "match" :{
                //       "certificates.certificateName": {
                //         "query":"英语四级",
                //         "boost":2
                //       }
                //     }
                //   }
            ]
            ,
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

/**
 * 以下测试用例仅包括「工作经验」这一条需求

 case 7-1: 一个仅包括「在校/应届」的测试用例
 - 查询仅包括「在校/应届」：
	1. 在 `must_not exists` 查询**不**包括`seekerUserInfo.initialJobDate`的文档
	
case 7-2: 一个不包括「在校/应届」的测试用例
- 查询不包括「在校/应届」：
	1. 在 `must exists` 查询**必须包括**`seekerUserInfo.initialJobDate`的文档

case 7-3: 一个同时包括「在校/应届」和其他经验的测试用例
- 查询既需要「在校/应届」，也需要其他经验：
		1. 在 `shuld[]` 内写两个子句：
			（1）  在 `must_not exists` 查询不包括`seekerUserInfo.initialJobDate`的文档；
			（2） 在 `must exists` 查询**必须包括**`seekerUserInfo.initialJobDate`的文档，此处是一个 `should bool query`，其内部有：
				① 一个 `must bool query`，里面有两个 `range query`：第一个社招枚举值的「最早年份的年头」和「最晚年份的年尾」
				② 一个 `must bool query`，里面有两个 `range query`：第二个社招枚举值的「最早年份的年头」和「最晚年份的年尾」
				...... 其余若干枚举值的「最早年份的年头」和「最晚年份的年尾」
 */

/**
 * case 7-1: 仅包括「在校/应届」
 */
POST /sjj-resume-test-1/_search
{
    "query": {
        "bool": {
            "must": [
                             
            ],
            "should": [
                
            ]
            ,
            "must_not": [
                {
                    // 原型需求4/6 ：不得存在工作经验，即仅校招/应届
                    "exists": {
                        "field":"seekerUserInfo.initialJobDate"
                    }
                }
            ]
        }
    }
}

/**
 * case 7-2: 不包括「在校/应届」
 */
POST /sjj-resume-test-1/_search
{
    "query": {
        "bool": {
            "must": [
                  {
                    // 原型需求4/6 ：不得存在工作经验，即仅校招/应届
                    "exists": {
                        "field":"seekerUserInfo.initialJobDate"
                    }
                }           
            ],
            "should": [
                
            ]
            ,
            "must_not": [
                
            ]
        }
    }
}

/**
 * case 7-3: 同时包括「在校/应届」和一年以内、一年到三年、三年到五年
 */
POST /sjj-resume-test-1/_search
{
    "_source": ["seekerUserInfo.initialJobDate"],
	"query": {
		"bool": {
			"should": [
				{
                    // 原型需求4/6 ：不得存在工作经验，即仅校招/应届
					"bool": {
						"must_not": [
                            {
                                "exists": {
                                    "field":"seekerUserInfo.initialJobDate"
                                    }
                            }
                        ]
					}
				},
                {
                    // 一年以内
					"range": {
						"seekerUserInfo.initialJobDate": {
                            "gte": "now-1y/d",
                            "lte":  "now/d",
                            "boost": 5

                        }
					}
				},
				{
                    // 一年到三年
					"range": {
						"seekerUserInfo.initialJobDate": {
                            "gte": "now-3y/d",
                            "lte":  "now-1y/d",
                            "boost": 8
                        }
					}
				},
				{
                    // 三年到五年
					"range": {
						"seekerUserInfo.initialJobDate": {
                            "gte": "now-5y/d",
                            "lte":  "now-3y/d",
                            "boost": 10
                        }
					}
				}
			],
			"must_not": []
		}
	}
}