
using AutoMapper;

namespace Scouter.Common.Resolvers
{
	/// <summary>
	/// IValueResolver
	/// </summary>
	/// <typeparam name="TSource"></typeparam>
	/// <typeparam name="TDestination"></typeparam>
	/// <typeparam name="TDestMember"></typeparam>
	public interface IValueResolver<in TSource, in TDestination, TDestMember>
	{
		/// <summary>
		/// Resolve
		/// </summary>
		/// <param name="source"></param>
		/// <param name="destination"></param>
		/// <param name="destMember"></param>
		/// <param name="context"></param>
		/// <returns></returns>
		TDestMember Resolve(TSource source, TDestination destination, TDestMember destMember, ResolutionContext context);
	}
}
