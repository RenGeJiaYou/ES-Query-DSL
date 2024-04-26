/**
 * 说明：在 case_1 基础上，添加了职位作为必选项，且权重设为最高 20
 * 作者：sjj
 */
POST /sjj-resume-test-1/_search
{
    "sort": {},
    "query": {
        "bool": {
            "must": [
              {
                "match":{
                  "desiredPositions.desiredPositionId":{
                    "query":"2ca4cd0e8e181243018e1b977fff0034",
                    "boost":20
                  }
                }
              }
            ],
            "should": [
              {
                "match" :{
                  "jobHistories.jobContent": {
                    "query":"前端",
                    "boost":10
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
                  "desiredPositions.jobCity.city": {
                    "query":"350100",
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
              }
            ],
            "must_not": []
        }
    },
    "aggs": {},
    "from": 0,
    "size": 20
}