using ScouterApi.Models;
using ScouterApi.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScouterApi.Processors
{
    /// <summary>
    /// Agent Processor
    /// </summary>
    public class ScoresProcessor
    {
        /// <summary>
        /// ProcessScoresAsync
        /// </summary>
        /// <param name="agentScores"></param>
        /// <returns></returns>
        public static async Task<IEnumerable<ConsensusModel>> ProcessScoresAsync(IEnumerable<Scouter.Data.EventModelDTO> agentScores)
        {
            try
            {
                // Calculate consensus times
                var scores = GenerateGameTime(agentScores.ToList());
                foreach (var (score, eventScore) in scores
                    .SelectMany(score => agentScores
                    .SelectMany(agentScore => agentScore.Events
                    .Where(eventScore => eventScore.ProcessedTime >= (score.ProcessedTime - 0.005M)
                                                     && (eventScore.ProcessedTime <= (score.ProcessedTime + 0.005M)))
                    .Select(eventScore => (score, eventScore)))))
                {
                    score.EventsCount++;
                    score.Time = score.Time < eventScore.EventTime ? eventScore.EventTime : score.Time;
                }

                return scores.Where(score => score.EventsCount > 0).ToList();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        /// <summary>
        /// Process Game Hits for all agents
        /// </summary>
        /// <param name="eventData"></param>
        /// <returns></returns>
        public static Dictionary<string, int> ProcessHits(IEnumerable<Scouter.Data.EventModelDTO> eventData)
        {
            try
            {
                //Filter to get the Master record
                var masterData = eventData.Where(d => d.IsMaster).FirstOrDefault();
                if (masterData == null) return null;

                Dictionary<string, int> hits = new Dictionary<string, int>();

                // Calculate hits for each agent
                foreach (var data in eventData)
                {
                    var agentHits = 0;
                    foreach (var masterScore in masterData.Events)
                    {
                        if (data.Events.Any(eventScore => Math.Round(eventScore.ProcessedTime, 1) == Math.Round(masterScore.ProcessedTime, 1)))
                        {
                            agentHits++;
                        }
                    }
                    hits.Add(data.Account, agentHits);
                }

                return hits;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        private static List<ConsensusModel> GenerateGameTime(List<Scouter.Data.EventModelDTO> agentScores)
        {
            var minEvent = agentScores.Min(agentScores => agentScores.Events.Min(eventScore => eventScore.ProcessedTime));
            var maxEvent = agentScores.Max(agentScores => agentScores.Events.Max(eventScore => eventScore.ProcessedTime));
            var scores = new List<ConsensusModel>();
            for (var i = minEvent; i < maxEvent; i += 0.01M)
            {
                scores.Add(new ConsensusModel
                {
                    Time = 0,
                    ProcessedTime = i,
                    EventsCount = 0,
                });
            }
            return scores;
        }

    }
}
