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
        /// <param name="events"></param>
        /// <returns></returns>
        public static async Task<IOrderedEnumerable<ScoreModel>> ProcessScoresAsync(IEnumerable<Scouter.Data.EventModelDTO> events)
        {
            try
            {
                // Calculate consensus times
                var scores = GenerateGameTime();

                foreach (var score in scores)
                {
                    score.SummaryCount += (events.Where(scoreEvent =>
                        scoreEvent.Events.Any(sig => (sig.ProcessedTime >= (score.Time - 0.005M))
                        || (sig.ProcessedTime) <= (score.Time + 0.005M)))).Count();
                }

                return scores.Where(score => score.SummaryCount > 0).OrderByDescending<ScoreModel, int>(score => score.SummaryCount);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        private static List<ScoreModel> GenerateGameTime()
        {
            var scores = new List<ScoreModel>();
            for (var i = 0.00M; i < 120.00M; i+=0.01M)
            {
                scores.Add(new ScoreModel
                {
                    Id = Guid.NewGuid(),
                    Time = i,
                    SummaryCount = 0,
                    UpdatedOn = DateTime.UtcNow.ToString(),
                    Scores = new List<Score>(),
                });
            }
            return scores;
        }

    }
}
