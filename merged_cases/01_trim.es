POST /sjj-resume-test-2/_search
{
	// "_source": [
	// 	"desiredPositions.desiredPositionType",
	// 	"highestEducationHistory.education",
	// 	"esiredPositions.jobCity",
	// 	"seekerUserInfo",
	// 	"desiredPositions.salary"
	// ],
	"query": {
		"bool": {
			"must": [
				{
                    // 原型需求1/8:求职者填写意向职位与当前职位（类型）的一级类型相符；
					"match": {
						"desiredPositions.desiredPositionType.firstLevel": {
							"query": "jobtype5bc468fe501809dc4d1000000",
							"boost": 20
						}
					}
				},
				{
                    // 原型需求3/8:求职者最高学历为检索条件及以上；
					"terms": {
                        // match 是全文检索，以下字符串将经过默认 analyzer 划分为若干 token，可以匹配多个字段，只要有一个字段匹配即可
                        // 本例为检索本科及以上：（本科 硕士 博士）
                        // 后续在 Java 中维护一个 String 常量数组，用于存储学历的 ID，输入 i,返回数组 [i]~[n-1] 左闭右闭
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
						"field": "desiredPositions.salary.min"
					}
				},
				{
                    // 原型需求5/8：level 1：筛选出填写了薪资信息的简历（去除将返回缺失该信息的所有简历）
					"exists": {
						"field": "desiredPositions.salary.max"
					}
				}
			],
			"should": [
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
									"field": "seekerUserInfo.initialJobDate"
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
							"boost": 5
						}
					}
				},
				{
                    // 原型需求4/8 ：拥有工作经验，一年到三年
					"range": {
						"seekerUserInfo.initialJobDate": {
							"gte": "now-3y/d",
							"lt": "now-1y/d",
							"boost": 8
						}
					}
				},
				{
                    // 原型需求4/8 ：拥有工作经验，三年到五年
					"range": {
						"seekerUserInfo.initialJobDate": {
							"gte": "now-5y/d",
							"lt": "now-3y/d",
							"boost": 10
						}
					}
				},
				{
					"bool": {
						"must": [
							{
                                // 原型需求5/8 level2（高优先级）：求职者期望顶薪 ≤ 当前职位顶薪
								"range": {
									"desiredPositions.salary.max": {
										"lte": 10000, // 此处应该是当前职位的顶薪
										"boost": 6
									}
								}
							},
							{
                                // 原型需求5/8 level2（高优先级）：求职者期望底薪 ≥ 当前职位底薪
								"range": {
									"desiredPositions.salary.min": {
										"gte": 6000, // 此处应该是当前职位的底薪
										"boost": 6
									}
								}
							}
						]
					}
				},
				{
					"range": {
                        // 原型需求5/8 level2（低优先级）：求职者期望顶薪 > 当前职位顶薪
						"desiredPositions.salary.max": {
							"gt": 10000, // 此处应该是当前职位的顶薪
							"boost": 3
						}
					}
				},
				{
					"range": {
                        // 原型需求5/8 level2（低优先级）：求职者期望底薪 < 当前职位底薪
						"desiredPositions.salary.min": {
							"lt": 6000, // 此处应该是当前职位的底薪
							"boost": 3
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
			"must_not": [
				{
                    // 原型需求5/8：level 1：简历中的底薪 不得大于 当前岗位顶薪
					"range": {
						"desiredPositions.salary.min": {
							"gt": 10000
						}
					}
				},
				{
                    // 原型需求7/8：要求设置为开放的简历才会被推荐
					"term": {
						"isOpened": false
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
	"aggs": {},
	"from": 0,
	"size": 20
}