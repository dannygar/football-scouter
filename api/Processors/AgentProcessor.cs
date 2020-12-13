﻿using ScouterApi.Models;
using ScouterApi.Utils;
using System;
using System.Threading.Tasks;

namespace ScouterApi.Processors
{
    /// <summary>
    /// Agent Processor
    /// </summary>
    public class AgentProcessor
    {
        /// <summary>
        /// AddAgentAsync
        /// </summary>
        /// <param name="agent"></param>
        /// <returns></returns>
        public async Task<Agent> AddAgentAsync(Agent agent)
        {
            try
            {
                using (var db = new CosmosUtil<Agent>("agents"))
                {
                    var theAgent = await db.GetItemAsync(agent.Id.ToString(), agent.Id.ToString());

                    if (theAgent != null) // Agent already exists
                        return theAgent;

                    // Otherwise, add a new agent
                    agent.CreatedOn = DateTime.UtcNow;

                    //Create or replace the Scores document
                    await db.UpsertItemAsync(agent);

                    return agent;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        /// <summary>
        /// GetAgent
        /// </summary>
        /// <param name="agentId"></param>
        /// <returns></returns>
        public async Task<Agent> GetAgent(Guid agentId)
        {
            try
            {
                using (var db = new CosmosUtil<Agent>("agents"))
                {
                    return await db.GetItemAsync(
                        agentId.ToString(),
                        agentId.ToString());
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}