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
                "term" :{
                  "desiredPositions.jobCity.city.keyword": "350100"
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

GET /sjj-resume-test-1/_search
{
    "query":{
        "term":{
            // 查询的是被匹配项的 keywords,可以精准匹配
            "highestEducationHistory.education.keyword":"educationBackground09dc4d43e0005"
        }
    }
}


GET /sjj-resume-test-1/_search
{
    "query":{
        "term":{
            // 匹配0结果
            "highestEducationHistory.education":"educationBackground09dc4d43e0005"
        }
    }
}




// 分析文本分词状况
GET /sjj-resume-test-1/_analyze
{
    "text": ["education Background 09dc4d43e0005"]
}

// 测试 exists 查询
GET /sjj-resume-test-1/_search
{
    "_source": ["seekerUserInfo.initialJobDate"],
    "query": {
                "exists":{
                    "field":"seekerUserInfo.initialJobDate"
                }
    }
}

// 测试 exists not 查询
GET /sjj-resume-test-1/_search
{
    "_source": ["seekerUserInfo"],
    "query": {
        "bool":{
            "must_not":{
                "exists":{
                    "field":"seekerUserInfo.initialJobDate"
                }
            }
        }
    }
}