﻿using NinosConValorAPI.Models;

namespace NinosConValorAPI.Services
{
    public interface IFixedAssetService
    {
        public Task<FixedAssetModel> CreateFixedAssetAsync(FixedAssetModel fixedAsset);
        Task<IEnumerable<FixedAssetModel>> GetFixedAssetsAsync();
        Task<FixedAssetModel> GetFixedAssetAsync(int fixedAssetId);
    }
}
