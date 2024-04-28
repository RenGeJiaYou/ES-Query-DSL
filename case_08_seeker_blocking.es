/**
 * 求职者已屏蔽的企业不纳入推荐范畴【求职端，先不做】。
 * 同时，若求职者将在线简历隐藏之后也不在推荐范畴
 *
 * 作者：sjj
 */


POST /sjj-resume-test-1/_search
{
	"_source": [
		"isOpened"
	],
	"query": {
		"bool": {
			"must": [
				{
                    // 要求设置为开放的简历才会被推荐
					"term": {
						"isOpened": true
					}
				}
			],
			"should": [],
			"must_not": []
		}
	}
}


/** 上下两者效果相同 */

POST /sjj-resume-test-1/_search
{
	"_source": [
		"isOpened"
	],
	"query": {
		"bool": {
			"must": [],
			"should": [],
			"must_not": [
				{
                    // 要求设置为开放的简历才会被推荐
					"term": {
						"isOpened": false
					}
				}
			]
		}
	}
}