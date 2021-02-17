using Scouter.Common.Models;
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
        private const decimal TimeDelta = 0.02M;

        /// <summary>
        /// ProcessScoresAsync
        /// </summary>
        /// <param name="agentScores"></param>
        /// <returns></returns>
        public static IEnumerable<ConsensusModel> ProcessScores(IEnumerable<Scouter.Data.EventModelDTO> agentScores)
        {
            try
            {
                // Calculate consensus times
                var scores = GenerateGameTime(agentScores.ToList());

                foreach (var agentScore in agentScores)
                {
                    foreach (var agentEvent in agentScore.Events)
                    {
                        var score = scores.Where(s => Math.Round(s.ProcessedTime,2) == Math.Round(agentEvent.ProcessedTime, 2)).FirstOrDefault();
                        if (score != null)
                        {
                            score.EventsCount++;
                            score.Time = agentEvent.EventTime;
                        }
                    }
                }

                //foreach (var (score, eventScore) in scores
                //    .SelectMany(score => agentScores
                //    .SelectMany(agentScore => agentScore.Events
                //    .Where(eventScore => eventScore.ProcessedTime >= (score.ProcessedTime - TimeDelta / 2.0M)
                //                                     && (eventScore.ProcessedTime <= (score.ProcessedTime + TimeDelta / 2.0M)))
                //    .Select(eventScore => (score, eventScore)))))
                //{
                //    score.EventsCount++;
                //    score.Time = score.Time < eventScore.EventTime ? eventScore.EventTime : score.Time;
                //}

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
        public static IEnumerable<ResultsModel> ProcessResults(IEnumerable<Scouter.Data.EventModelDTO> eventData)
        {
            try
            {
                //Filter to get the Master record
                var masterData = eventData.Where(d => d.IsMaster).FirstOrDefault();
                if (masterData == null) return null;

                List<ResultsModel> results = new List<ResultsModel>();

                // Calculate hits for each agent
                foreach (var data in eventData.Where(d => d.IsMaster == false).ToList())
                {
                    var agentResult = new ResultsModel
                    {
                        Id = Guid.NewGuid(),
                        UpdatedOn = DateTime.UtcNow.ToString(),
                        GameId = data.GameId.ToString(),
                        AgentId = data.Account,
                        DisplayName = ParseEmail(data.Email),
                    };

                    // Calculate # of hits
                    foreach (var masterScore in masterData.Events)
                    {
                        if (data.Events.Any(eventScore => Math.Round(eventScore.ProcessedTime, 2) >=
                            (Math.Round(masterScore.ProcessedTime, 2) - TimeDelta) &&
                            (Math.Round(eventScore.ProcessedTime, 2) <= (Math.Round(masterScore.ProcessedTime, 2) + TimeDelta))))
                        {
                            agentResult.Hits++;
                        }
                    }

                    // Calculate # of maverics
                    agentResult.Maverics = data.Events.Count() - agentResult.Hits;

                    // Update the Score
                    agentResult.Score = Math.Round(agentResult.Hits - agentResult.Maverics / 2.0M, 1);

                    // Add to the list of scores
                    results.Add(agentResult);

                }

                return results.OrderByDescending(r => r.Score);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        private static string ParseEmail(string email)
        {
            var emailParts = email.Split('@');
            return (emailParts.Length > 0) ? emailParts[0] : email;
        }


        private static List<ConsensusModel> GenerateGameTime(List<Scouter.Data.EventModelDTO> agentScores)
        {
            var minEvent = Math.Round(agentScores.Min(agentScores => agentScores.Events.Min(eventScore => eventScore.ProcessedTime)), 0);
            var maxEvent = Math.Ceiling(agentScores.Max(agentScores => agentScores.Events.Max(eventScore => eventScore.ProcessedTime)));
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
