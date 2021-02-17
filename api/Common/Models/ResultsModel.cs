using System.Runtime.Serialization;

namespace Scouter.Common.Models
{
    public class ResultsModel: BaseModel
    {
        [DataMember(Name = "gameId")]
        public string GameId { get; set; }

        [DataMember(Name = "agentId")]
        public string AgentId { get; set; }

        [DataMember(Name = "displayName")]
        public string DisplayName { get; set; }

        [DataMember(Name = "hits")]
        public int Hits { get; set; }

        [DataMember(Name = "maverics")]
        public int Maverics { get; set; }

        [DataMember(Name = "score")]
        public decimal Score { get; set; }
    }
}
