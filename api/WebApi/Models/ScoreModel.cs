
namespace ScouterApi.Models
{
    using Scouter.Common;
    using System.Collections.Generic;

    /// <summary>
    /// Scores
    /// </summary>
    public class ScoreModel : BaseModel
    {
        public decimal Time { get; set; }

        public List<Score> Scores { get; set; }

        public int SummaryCount { get; set; }
    }

    public class Score
    {
        public string Account { get; set; }
        public bool Count { get; set; }
    }
}
