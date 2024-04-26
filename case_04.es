/**
 * 说明：在 case_3 基础上，添加需求「求职者 期望行业 与当前职位对应公司的行业相符」
 * 注释掉 must 里的子句，否则将太严苛而无查询结果
 * 作者：sjj
 */
POST /sjj-resume-test-1/_search
{
    "sort": {},
    "query": {
        "bool": {
            "must": [
            //   {
            //     // 原型需求1/6:求职者填写意向职位与当前职位（类型）的一级类型相符；
            //     "match" :{
            //       "desiredPositions.desiredPositionType.firstLevel": {
            //         "query":"jobtype5bc468fe501809dc4d1000000",
            //         "boost":20
            //       }
            //     }
            //   }
            ],
            "should": [
              {
                "match":{
                  "desiredPositions.desiredPositionId":{
                    "query":"2ca4cd0e8e181243018e1b977fff0034",
                    "boost":10
                  }
                }
              },
            {
                // 原型需求2/6: 求职者期望工作的城市与当前职位相符；
                "match" :{
                  "desiredPositions.jobCity.city": {
                    "query":"350100",
                    "boost":8
                  }
                }
              },
              {
                "match" :{
                  "highestEducationHistory.profession": {
                    "query":"计算机 软件",
                    "boost":8
                  }
                }
              },

              {
                "match" :{
                  "certificates.certificateName": {
                    "query":"英语四级",
                    "boost":2
                  }
                }
              },
              {
                // 原型需求6/6：求职者 期望行业 与当前职位对应公司的行业相符
                "match" :{
                  "desiredPositions.companyIndustry.industry": {
                    "query":"industrytype5bc46fe09dc4d4100004", 
                    "boost":4
                    }
                }
              }
            ],
            "must_not": []
        }
    },
    "aggs": {},
    "from": 0,
    "size": 20
}