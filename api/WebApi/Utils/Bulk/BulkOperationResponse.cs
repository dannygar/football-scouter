using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScouterApi.Utils.Bulk
{
    public class BulkOperationResponse<T>
    {
        public TimeSpan TotalTimeTaken { get; set; }
        public int SuccessfulDocuments { get; set; } = 0;
        public double TotalRequestUnitsConsumed { get; set; } = 0;

        public IReadOnlyList<(T, Exception)> Failures { get; set; }
    }
}
