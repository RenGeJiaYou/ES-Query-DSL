/**
 * 说明：根据用户的简历信息，进行职位推荐
 * 作者：sjj
 */
POST /sjj-resume-test-1/_search
{
    "sort": {},
    "query": {
        "bool": {
            "must": [],
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