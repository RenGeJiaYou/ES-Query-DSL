/**
 * 9-1 检测是否存在 求职者屏蔽的公司IDs、屏蔽我的公司IDs、屏蔽我的招聘者IDs 字段
 * 注意，本用例不能放进原型需求中，因为只是测试是否存在这些字段。
 * 如果误用，会导致求职者只有拉黑点什么才能被检索到。
 * 作者：sjj
 */
GET /sjj-resume-test-2/_search
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


/**
 * 9-2 需要排除的返回结果满足以下条件：
 * 1. [请求入参]当前公司ID 匹配到[ES 字段]求职者屏蔽的公司IDs、
 * 2. [请求入参]当前公司ID 匹配到[ES 字段]屏蔽我的公司IDs、
 * 3. [请求入参]当前招聘者 ID 匹配到[ES 字段]屏蔽我的招聘者IDs 字段
 *
 * 作者：sjj
 */
GET /sjj-resume-test-1/_search
{
	"query": {
		"bool": {
			"must_not": [
				{
                    // 原型需求8/8: 测试是否匹配求职者屏蔽公司字段
					"term": {
						 "resumeRedundancy.queryRedundancyInfo.iBlockedUnitIdList":""
					}
				},
				{
                    // 原型需求8/8: 测试是否匹配招聘者屏蔽求职者字段（7条匹配数据）
					"term": {
						"resumeRedundancy.queryRedundancyInfo.blockedMeRecruiterUserIdList":"2ca4ed2489a9ca510189aa0993490148"
					}
				},
                {
                    // 原型需求8/8: 测试是否匹配屏蔽求职者字段（7条匹配数据）
					"term": {
						"resumeRedundancy.queryRedundancyInfo.blockedMeUnitIdList":""
					}
                }
			]
		}
	}
}