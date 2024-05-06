/**
 * 说明：在 case_2 基础上，添加了
 * 1. [must] （求职目标||工作经历）的职位一级类型作为必选项，响应且仅响应符合条件的项
 * 2. [should] 期望工作城市作为可选项，在[must]过滤后的若干项中进行优先级排序

 * 注意：must 里的条件加不加 boost 不影响排序，哪怕是 must 内 should 下的条件中加boost也不影响排序
 * 作者：sjj
 */
POST /sjj-resume-test-2/_search
{
  "_source": [
    "desiredPositions.jobCity.city"
  ],
  "query": {
    "bool": {
      "must": [
        {
          "bool": {
            "should": [
              {
                "term": {
                  "desiredPositions.desiredPositionType.firstLevel.keyword": "jobtype5bc468fe501809dc4d1000000"
                }
              },
              {
                "match": {
                  "jobHistories.firstLevel": "jobtype5bc468fe501809dc4d1000000"
                }
              }
            ]
          }
        }
      ],
      "should": [
        {
          "match": {
            "desiredPositions.jobCity.city": {
              "query": "350100",
              "boost": 2
            }
          }
        }
      ],
      "must_not": []
    }
  },
  "explain": false
}