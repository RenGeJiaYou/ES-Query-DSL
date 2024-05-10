// 挖掘新需求（1）：根据搜索栏关键字同时去多个字段中查询
// 涉及字段包括：
// jobHistories 工作经历中的 `text`，特别是 `jobHistories.jobContent`
// seekerUserInfo 求职者信息的 `text`，特别是 `advantage` 个人优势介绍
// projectHistories 项目经历的 `text`
// trainingHistories 培训经历的 `text`
GET /sjj-resume-test-1/_search
{
	"query": {
    "multi_match": {
        "query": "java",
        "fields": [
            "jobHistories.jobContent^3",
            "seekerUserInfo.advantage^2",
            "projectHistories.projectRole",
            "trainingHistories.trainingContent"
        ]
    }
}
}