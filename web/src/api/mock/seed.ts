/**
 * Seed data for the in-memory mock GraphQL backend.
 *
 * Sourced from `Impl/LisaServer/Resources/Database/CreateTables.sql` (the
 * canonical Lisa SQL seed). This keeps the dev experience anchored to the
 * exact same packages, features, products and licenses that the C++ server
 * boots with, so the web app behaves identically to QML against a fresh DB.
 *
 * Updated to match ImtCore SDL shapes (ProductItem, LicenseItem, FeatureItem, etc.).
 */
import type {
  ProductItem,
  LicenseItem,
  FeatureData,
  UserItemData,
  AuthorizationPayload,
} from '@/types/domain';

const now = () => new Date().toISOString();
const ts = now();

// Seed users with credentials (for mock login)
export const seedUsers: Array<{
  password: string;
  payload: AuthorizationPayload;
  permissions: string[];
}> = [
  {
    password: 'admin',
    payload: {
      userId: 'u-admin',
      username: 'admin',
      token: 'mock-token-admin',
      refreshToken: 'mock-refresh-admin',
      systemId: 'system-1',
      permissions: [
        'ViewProducts',
        'AddProduct',
        'ChangeProduct',
        'RemoveProduct',
        'ViewLicenses',
        'AddLicense',
        'ChangeLicense',
        'RemoveLicense',
        'ViewFeatures',
        'AddFeature',
        'EditFeature',
        'ChangeFeature',
        'RemoveFeature',
        'ViewUsers',
        'AddUser',
        'ChangeUser',
        'RemoveUser',
        'Administration',
      ].join(';'),
    },
    permissions: [
      'ViewProducts',
      'AddProduct',
      'ChangeProduct',
      'RemoveProduct',
      'ViewLicenses',
      'AddLicense',
      'ChangeLicense',
      'RemoveLicense',
      'ViewFeatures',
      'AddFeature',
      'EditFeature',
      'ChangeFeature',
      'RemoveFeature',
      'ViewUsers',
      'AddUser',
      'ChangeUser',
      'RemoveUser',
      'Administration',
    ],
  },
  {
    password: 'view',
    payload: {
      userId: 'u-viewer',
      username: 'viewer',
      token: 'mock-token-viewer',
      refreshToken: 'mock-refresh-viewer',
      systemId: 'system-1',
      permissions: ['ViewProducts', 'ViewLicenses', 'ViewFeatures', 'ViewUsers'].join(';'),
    },
    permissions: ['ViewProducts', 'ViewLicenses', 'ViewFeatures', 'ViewUsers'],
  },
];

// FeatureData tree (matching FeatureData SDL type)
const feat = (
  id: string,
  featureId: string,
  featureName: string,
  opts: Partial<FeatureData> = {},
): FeatureData => ({
  id,
  featureId,
  featureName,
  name: featureName,
  description: opts.description,
  optional: opts.optional ?? false,
  isPermission: opts.isPermission ?? false,
  dependencies: opts.dependencies ?? '',
  subFeatures: opts.subFeatures ?? [],
});

// Feature packages are flattened into FeatureItems for FeaturesList
export const seedFeatureItems: FeatureData[] = [
  // StandardFramework
  feat('f-um', '#UserManagement', 'User Management'),
  feat('f-de', '#DataExport', 'Data Export'),
  feat('f-bio', '#BiometricAccess', 'Biometric Authentification'),
  feat('f-rep', '#Report', 'Report'),
  feat('f-ms', '#ModelSearch', 'Model Search'),
  feat('f-auto', '#Automatic', 'Automatic'),
  // RTVisionFramework
  feat('f-rov', '#ResultOverview', 'Result Overview'),
  feat('f-pi', '#PatchInspection', 'Patch Inspection'),
  // RTVision3dFramework
  feat('f-pri', '#PrimerInspection', 'Primer Inspection', { optional: true }),
  feat('f-vol', '#VolumeInspection', 'Volume Inspection', { optional: true }),
  feat('f-tea', '#Teaching', 'Teaching'),
  feat('f-poc', '#PositionCorrection', 'Position Correction', { optional: true }),
];

export const seedProducts: ProductItem[] = [
  {
    id: 'TCVision.l',
    name: 'TCVision.l',
    productName: 'TCVision.l',
    typeId: 'Product',
    productId: 'TCVision.l',
    categoryId: 'Software',
    description: 'Shell inspection (Liner)',
    features: '',
    licenses: [],
    added: ts,
    timeStamp: ts,
  },
  {
    id: 'TCVision.e',
    name: 'TCVision.e',
    productName: 'TCVision.e',
    typeId: 'Product',
    productId: 'TCVision.e',
    categoryId: 'Software',
    description: 'End inspection',
    features: '',
    licenses: [],
    added: ts,
    timeStamp: ts,
  },
  {
    id: 'RTVision',
    name: 'RTVision',
    productName: 'RTVision',
    typeId: 'Product',
    productId: 'RTVision',
    categoryId: 'Software',
    description: 'Glue width inspection based in 2D-space',
    features: '#ResultOverview;#PatchInspection',
    licenses: [
      { id: '12.1234', name: 'Standard', licenseId: '12.1234', licenseName: 'Standard' },
    ],
    added: ts,
    timeStamp: ts,
  },
  {
    id: 'RTVision.3d',
    name: 'RTVision.3d',
    productName: 'RTVision.3d',
    typeId: 'Product',
    productId: 'RTVision.3d',
    categoryId: 'Software',
    description: 'Complete glue evaluation in 3D-space',
    features: '#Teaching;#VolumeInspection;#PrimerInspection',
    licenses: [
      { id: '12.10128', name: 'Standard', licenseId: '12.10128', licenseName: 'Standard' },
      { id: '12.10135', name: 'Advanced', licenseId: '12.10135', licenseName: 'Advanced' },
      {
        id: '12.10140',
        name: 'Position Correction',
        licenseId: '12.10140',
        licenseName: 'Position Correction',
      },
    ],
    added: ts,
    timeStamp: ts,
  },
];

export const seedLicenses: LicenseItem[] = [
  {
    id: '12.1234',
    typeId: 'License',
    licenseId: '12.1234',
    licenseName: 'Standard',
    description: 'Standard license for RTVision product',
    productId: 'RTVision',
    features: '#ResultOverview;#PatchInspection',
    added: ts,
    timeStamp: ts,
  },
  {
    id: '12.10128',
    typeId: 'License',
    licenseId: '12.10128',
    licenseName: 'Standard',
    description: 'Standard license for RTVision.3d product',
    productId: 'RTVision.3d',
    features: '#Teaching',
    added: ts,
    timeStamp: ts,
  },
  {
    id: '12.10135',
    typeId: 'License',
    licenseId: '12.10135',
    licenseName: 'Advanced',
    description: 'Advanced license for RTVision.3d product',
    productId: 'RTVision.3d',
    features: '#Teaching;#VolumeInspection',
    added: ts,
    timeStamp: ts,
  },
  {
    id: '12.10140',
    typeId: 'License',
    licenseId: '12.10140',
    licenseName: 'Position Correction',
    description: 'Standard + position correction license for RTVision.3d product',
    productId: 'RTVision.3d',
    features: '#Teaching;#PositionCorrection',
    added: ts,
    timeStamp: ts,
  },
];

export const seedUserItems: UserItemData[] = [
  {
    id: 'u-admin',
    typeId: 'User',
    userId: 'u-admin',
    name: 'Administrator',
    description: 'System administrator',
    mail: 'admin@imagingtools.local',
    systemId: 'system-1',
    systemName: 'Lisa',
    roles: 'role-admin',
    groups: 'group-admins',
    added: ts,
    lastModified: ts,
    lastConnection: ts,
  },
  {
    id: 'u-viewer',
    typeId: 'User',
    userId: 'u-viewer',
    name: 'Read-only Viewer',
    description: 'View-only user',
    mail: 'viewer@imagingtools.local',
    systemId: 'system-1',
    systemName: 'Lisa',
    roles: 'role-viewer',
    groups: 'group-viewers',
    added: ts,
    lastModified: ts,
    lastConnection: ts,
  },
];
