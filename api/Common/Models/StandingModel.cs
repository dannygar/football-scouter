using System.Runtime.Serialization;

namespace Scouter.Common.Models
{
    public class StandingModel: BaseModel
    {
        [DataMember(Name = "agentId")]
        public string AgentId { get; set; }

        [DataMember(Name = "displayName")]
        public string DisplayName { get; set; }

        [DataMember(Name = "score")]
        public decimal Score { get; set; }
    }
}
