
namespace ScouterApi.Models
{
    using Scouter.Common;
    using System.Collections.Generic;
    using System.Runtime.Serialization;

    /// <summary>
    /// Scores
    /// </summary>
    public class ScoreModel : BaseModel
    {
        [DataMember(Name = "time")]
        public decimal Time { get; set; }

        [DataMember(Name = "timeProc")]
        public decimal TimeProc { get; set; }

        [DataMember(Name = "scores")]
        public List<Score> Scores { get; set; }

        [DataMember(Name = "summaryCount")]
        public int SummaryCount { get; set; }
    }

    public class Score
    {
        [DataMember(Name = "account")]
        public string Account { get; set; }
        [DataMember(Name = "count")]
        public bool Count { get; set; }
    }
}
