POST /sjj-resume-test-1/_search
{
    "sort": {},
    "query": {
        "bool": {
            "must": [
              {
                // 原型需求1/8:求职者填写意向职位与当前职位（类型）的一级类型相符；
                "match" :{
                  "desiredPositions.desiredPositionType.firstLevel": {
                    "query":"jobtype5bc468fe501809dc4d1000000",
                    "boost":20
                  }
                }
              },
              {
                // 原型需求3/8:求职者最高学历为检索条件及以上；
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
                // 原型需求2/8: 求职者期望工作的城市与当前职位相符；
                "match" :{
                  "desiredPositions.jobCity.city": {
                    "query":"350100",
                    "boost":10
                  }
                }
              },
			  {
                    // 原型需求4/8 ：不得存在工作经验，即仅校招/应届
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
                    // 原型需求4/8 ：拥有工作经验，一年以内
					"range": {
						"seekerUserInfo.initialJobDate": {
                            "gte": "now-1y/d",
                            "lte":  "now/d",
                            "boost": 5

                        }
					}
			  },
			  {
                    // 原型需求4/8 ：拥有工作经验，一年到三年
					"range": {
						"seekerUserInfo.initialJobDate": {
                            "gte": "now-3y/d",
                            "lte":  "now-1y/d",
                            "boost": 8
                        }
					}
			  },
			  {
                    // 原型需求4/8 ：拥有工作经验，三年到五年
					"range": {
						"seekerUserInfo.initialJobDate": {
                            "gte": "now-5y/d",
                            "lte":  "now-3y/d",
                            "boost": 10
                        }
					}
			  },
              {
                // 原型需求6/8：求职者 期望行业 与当前职位对应公司的行业相符
                "match" :{
                  "desiredPositions.companyIndustry.industry": {
                    "query":"industrytype5bc46fe09dc4d4100004", 
                    "boost":4
                    }
                }
              }
              /**
               * ========================================
               * ↓以下都是非原型需求，但有必要添加的搜索条件↓
               * ========================================
               */
            //   {
            //     // 当前职位 匹配 简历中期望工作岗位ID
            //     "match":{
            //       "desiredPositions.desiredPositionId":{
            //         "query":"",
            //         "boost":1
            //       }
            //     }
            //   },
            //   {
            //     // 招聘所需专业 匹配 简历中最高学历专业方向
            //     "match" :{
            //       "highestEducationHistory.profession": {
            //         "query":"",
            //         "boost":1
            //       }
            //     }
            //   },
            //   {
            //     // 招聘所需证书 匹配 简历中所含证书（后续优化方案：使用 exist，包含则提高评分）
            //     "match" :{
            //       "certificates.certificateName": {
            //         "query":"",
            //         "boost":2
            //       }
            //     }
            //   }
            ],
            "must_not": []
        }
    },
    "aggs": {},
    "from": 0,
    "size": 20
}