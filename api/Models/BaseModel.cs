// <copyright file="BaseModel.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.TXT file in the project root for full license information.
// </copyright>

namespace ScouterApi.Models
{
    using System;
    using System.Runtime.Serialization;

    /// <summary>
    /// Base model class.
    /// </summary>
    [DataContract]
    public class BaseModel : IEquatable<BaseModel>
    {
        /// <summary>
        /// Gets or sets the identifier in Cosmos Db.
        /// </summary>
        /// <value>The identifier.</value>
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        /// <summary>
        ///  Gets or sets the UpdatedOn
        /// </summary>
        [DataMember(Name = "updatedOn")]
        public string UpdatedOn { get; set; }

        /// <summary>
        /// Implements the == operator.
        /// </summary>
        /// <param name="obj1">The obj1.</param>
        /// <param name="obj2">The obj2.</param>
        /// <returns>The result of the operator.</returns>
        public static bool operator ==(BaseModel obj1, BaseModel obj2)
        {
            if (((object)obj1) == null || ((object)obj2) == null)
            {
                return Equals(obj1, obj2);
            }

            return obj1.Equals(obj2);
        }

        /// <summary>
        /// Implements the != operator.
        /// </summary>
        /// <param name="obj1">The obj1.</param>
        /// <param name="obj2">The obj2.</param>
        /// <returns>The result of the operator.</returns>
        public static bool operator !=(BaseModel obj1, BaseModel obj2)
        {
            if (((object)obj1) == null || ((object)obj2) == null)
            {
                return !Equals(obj1, obj2);
            }

            return !obj1.Equals(obj2);
        }

        /// <summary>
        /// Indicates whether the current object is equal to another object of the same type.
        /// </summary>
        /// <param name="other">An object to compare with this object.</param>
        /// <returns>true if the current object is equal to the <paramref name="other">other</paramref> parameter; otherwise, false.</returns>
        public bool Equals(BaseModel other)
        {
            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return this.Id.Equals(other.Id);
        }

        /// <summary>
        /// Determines whether the specified <see cref="object" /> is equal to this instance.
        /// </summary>
        /// <param name="obj">The object to compare with the current object.</param>
        /// <returns><c>true</c> if the specified <see cref="object" /> is equal to this instance; otherwise, <c>false</c>.</returns>
        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj))
            {
                return false;
            }

            if (ReferenceEquals(this, obj))
            {
                return true;
            }

            return (obj is BaseModel baseObj) && this.Equals(baseObj);
        }

        /// <summary>
        /// Returns a hash code for this instance.
        /// </summary>
        /// <returns>A hash code for this instance, suitable for use in hashing algorithms and data structures like a hash table.</returns>
        public override int GetHashCode()
        {
            return HashCode.Combine(this.Id);
        }
    }
}