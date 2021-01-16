using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScouterApi.Utils.Bulk
{
    public class OperationResponse<T>
    {
        public T Item { get; set; }
        public double RequestUnitsConsumed { get; set; } = 0;
        public bool IsSuccessful { get; set; }
        public Exception CosmosException { get; set; }
    }
}
