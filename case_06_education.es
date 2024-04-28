/**
 * 说明：在 case_5 基础上，添加需求
 *「求职者的**学历**需符合大于等于当前职位学历要求；
 * 优先完整匹配、接着按职位要求学历要求逐一递增筛选」
 *
 * 对应 JSON 字段：highestEducationHistory.education
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
                    "match":{
                        // match 是全文检索，以下字符串将经过默认 analyzer 划分为若干 token，可以匹配多个字段，只要有一个字段匹配即可
                        // 本例为检索本科及以上：（本科 硕士 博士）
                        "highestEducationHistory.education":
                            "educationBackground09dc4d43e0005 educationBackground09dc4d43e0006 educationBackground09dc4d43e0008"
                        
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
                                        "boost": 60
                                    }
                                }
                            },
                            {
                                // 原型需求5/6 level2（高优先级）：求职者期望底薪 ≥ 当前职位底薪
                                "range": {
                                    "desiredPositions.salary.min": {
                                        "gte": 6000, //此处应该是当前职位的底薪
                                        "boost": 60
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
 * 说明：学历检索更换成 terms 查询
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