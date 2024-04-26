/**
 * 说明：在 case_5 基础上，添加需求
 *「求职者的**学历**需符合大于等于当前职位学历要求；
 * 优先完整匹配、接着按职位要求学历要求逐一递增筛选」
 *
 * 对应 JSON 字段：highestEducationHistory.education
 *
 * 作者：sjj
 */
GET /sjj-resume-test-1/_search
{
	"query": {
		"match_all": {}
	}
}