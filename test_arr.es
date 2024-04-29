POST /sjj-resume-test-1/_search
{
    // ES 访问数组内的字段和其他查询并无不同，仿佛[]内的字段是一个普通字段
    "_source": ["desiredPositions.desiredJobNature"],
	"query": {
        "match":{
		"desiredPositions.desiredJobNature":"recruitment0eb3dcbcf5041wef69101"

        }
	}
}