/**
 * 9-1 检测是否存在 求职者屏蔽的公司IDs、屏蔽我的公司IDs、屏蔽我的招聘者IDs 字段
 */
GET /sjj-resume-test-1/_search
{
	"query": {
		"bool": {
			"should": [
				{
                    // 测试是否存在求职者屏蔽公司字段（1条匹配数据）
					"exists": {
						"field": "resumeRedundancy.queryRedundancyInfo.iBlockedUnitIdList"
					}
				},
				{
                    // 测试是否存在招聘者屏蔽求职者字段（7条匹配数据）
					"exists": {
						"field": "resumeRedundancy.queryRedundancyInfo.blockedMeRecruiterUserIdList"
					}
				},
                {
                    // 测试是否存在屏蔽求职者字段（7条匹配数据）
					"exists": {
						"field": "resumeRedundancy.queryRedundancyInfo.blockedMeUnitIdList"
					}
                }
			]
		}
	}
}

GET /sjj-resume-test-1/_search
{
	"query": {
		"bool": {
			"must_not": [
				{
                    // 测试是否存在求职者屏蔽公司字段（1条匹配数据）
					"term": {
						 "resumeRedundancy.queryRedundancyInfo.iBlockedUnitIdList":"2ca4cd3089aa6b8c0189aaa986df002a"
					}
				},
				{
                    // 测试是否存在招聘者屏蔽求职者字段（7条匹配数据）
					"term": {
						"resumeRedundancy.queryRedundancyInfo.blockedMeRecruiterUserIdList":""
					}
				},
                {
                    // 测试是否存在屏蔽求职者字段（7条匹配数据）
					"term": {
						"resumeRedundancy.queryRedundancyInfo.blockedMeUnitIdList":""
					}
                }
			]
		}
	}
}