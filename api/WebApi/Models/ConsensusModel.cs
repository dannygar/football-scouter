
namespace ScouterApi.Models
{
    using System.Runtime.Serialization;

    /// <summary>
    /// ConsensusModel
    /// </summary>
    public class ConsensusModel
    {
        [DataMember(Name = "time")]
        public decimal Time { get; set; }

        [DataMember(Name = "processedTime")]
        public decimal ProcessedTime { get; set; }

        [DataMember(Name = "eventsCount")]
        public int EventsCount { get; set; }
    }
}
