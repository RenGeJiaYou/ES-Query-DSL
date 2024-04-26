/**
 * 说明：在 case_4 基础上，添加需求
 *「求职者的期望薪资范围优先匹配落在当前职位薪资范围内，
 *  再推荐期望最低信息有在职位薪资范围内」
 * 注意要配合 exist 来使用，确保求职者的期望薪资信息完整
 *
 *
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
				}
              /*{
                // 原型需求1/6:求职者填写意向职位与当前职位（类型）的一级类型相符；
                "match" :{
                  "desiredPositions.desiredPositionType.firstLevel": {
                    "query":"jobtype5bc468fe501809dc4d1000000",
                    "boost":20
                  }
                }
              },*/
			],
			"should": [
				{
          // 原型需求5/6 level2（高优先级）：求职者期望顶薪 ≤ 当前职位顶薪
					"range": {
						"desiredPositions.salary.max": {
							"lte": 10000,
							"boost": 60
						}
					}
				},
				{
          // 原型需求5/6 level2（高优先级）：求职者期望底薪 ≥ 当前职位底薪
					"range": {
						"desiredPositions.salary.min": {
							"gte": 6000,
							"boost": 60
						}
					}
				},
				{
          // 原型需求5/6 level2（低优先级）：求职者期望顶薪 > 当前职位顶薪
					"range": {
						"desiredPositions.salary.max": {
							"gt": 10000,
							"boost": 3
						}
					}
				},
				{
          // 原型需求5/6 level2（低优先级）：求职者期望底薪 < 当前职位底薪
					"range": {
						"desiredPositions.salary.min": {
							"lt": 6000,
							"boost": 3
						}
					}
				}
            //,
            //   {
            //     "match":{
            //       "desiredPositions.desiredPositionId":{
            //         "query":"2ca4cd0e8e181243018e1b977fff0034",
            //         "boost":10
            //       }
            //     }
            //   },
            // {
            //     // 原型需求2/6: 求职者期望工作的城市与当前职位相符；
            //     "match" :{
            //       "desiredPositions.jobCity.city": {
            //         "query":"350100",
            //         "boost":8
            //       }
            //     }
            //   },
            //   {
            //     "match" :{
            //       "highestEducationHistory.profession": {
            //         "query":"计算机 软件",
            //         "boost":8
            //       }
            //     }
            //   },
            //   {
            //     // 原型需求6/6：求职者 期望行业 与当前职位对应公司的行业相符
            //     "match" :{
            //       "desiredPositions.companyIndustry.industry": {
            //         "query":"industrytype5bc46fe09dc4d4100004", 
            //         "boost":4
            //         }
            //     }
            //   },
            //  {
            //     "match" :{
            //       "certificates.certificateName": {
            //         "query":"英语四级",
            //         "boost":2
            //       }
            //     }
            //   }
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