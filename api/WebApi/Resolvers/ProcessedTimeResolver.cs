using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScouterApi.Resolvers
{
    /// <summary>
    /// ProcessedTimeResolver
    /// </summary>
    public class ProcessedTimeResolver : IValueResolver<ScouterApi.Models.SignificantEvent, Scouter.Data.SignificantEvent, decimal>
    {
        private const decimal TIME2DEC_CONVERTOR = 0.6M;
        /// <summary>
        /// Resolve
        /// </summary>
        /// <param name="source"></param>
        /// <param name="destination"></param>
        /// <param name="destMember"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public decimal Resolve(
            Models.SignificantEvent source,
            Scouter.Data.SignificantEvent destination,
            decimal destMember,
            ResolutionContext context)
        {
            var whole = Math.Truncate(source.EventTime);

            return whole + (source.EventTime - whole) / TIME2DEC_CONVERTOR;
        }
    }
}
