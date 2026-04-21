/**
 * Base types shared across ImtCore SDL files.
 * Source: ImtCore/Sdl/imtbase/1.0/ (common types)
 */
export const ImtBaseTypesSDL = `
  scalar ID
  scalar String
  scalar Int
  scalar Integer
  scalar Bool
  scalar Boolean
  scalar Float
  
  # Custom scalars used by imt SDL (treated as opaque strings in mock)
  scalar ComplexCollectionFilter
  scalar DocumentCollectionFilter
  scalar ParamsSet
`;
