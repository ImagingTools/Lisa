/**
 * Seed data for the in-memory mock GraphQL backend.
 *
 * Sourced from `Impl/LisaServer/Resources/Database/CreateTables.sql` (the
 * canonical Lisa SQL seed). This keeps the dev experience anchored to the
 * exact same packages, features, products and licenses that the C++ server
 * boots with, so the web app behaves identically to QML against a fresh DB.
 */
import type {
  Account,
  Feature,
  FeaturePackage,
  License,
  Product,
  SessionUser,
} from '@/types/domain';

const now = () => new Date().toISOString();
const ts = now();

const meta = (uuid: string, typeId: string, owner = 'system') => ({
  uuid,
  typeId,
  lastModified: ts,
  created: ts,
  owner,
  revision: 1,
});

const feat = (
  uuid: string,
  featureId: string,
  featureName: string,
  packageId: string,
  opts: Partial<Feature> = {},
): Feature => ({
  uuid,
  featureId,
  featureName,
  packageId,
  description: opts.description,
  optional: opts.optional ?? false,
  isPermission: opts.isPermission ?? false,
  dependencies: opts.dependencies ?? [],
  subFeatures: opts.subFeatures ?? [],
});

export const seedPackages: FeaturePackage[] = [
  {
    id: 'StandardFramework',
    name: 'Standard Framework',
    description: 'Common features for all products',
    features: [
      feat('f-um', '#UserManagement', 'User Management', 'StandardFramework'),
      feat('f-de', '#DataExport', 'Data Export', 'StandardFramework'),
      feat('f-bio', '#BiometricAccess', 'Biometric Authentification', 'StandardFramework'),
      feat('f-rep', '#Report', 'Report', 'StandardFramework'),
      feat('f-ms', '#ModelSearch', 'Model Search', 'StandardFramework'),
      feat('f-auto', '#Automatic', 'Automatic', 'StandardFramework'),
    ],
  },
  {
    id: 'TCVisionFramework',
    name: 'TCVision Framework',
    description: 'Common features for all products of the TCVision family',
    features: [],
  },
  {
    id: 'RTVisionFramework',
    name: 'RTVision Framework',
    description: 'Common features for all products of the RTVision family',
    features: [
      feat('f-rov', '#ResultOverview', 'Result Overview', 'RTVisionFramework'),
      feat('f-pi', '#PatchInspection', 'Patch Inspection', 'RTVisionFramework'),
    ],
  },
  {
    id: 'RTVision3dFramework',
    name: 'RTVision.3d Framework',
    description: 'Common features of the RTV-3D-products',
    features: [
      feat('f-pri', '#PrimerInspection', 'Primer Inspection', 'RTVision3dFramework', {
        optional: true,
      }),
      feat('f-vol', '#VolumeInspection', 'Volume Inspection', 'RTVision3dFramework', {
        optional: true,
      }),
      feat('f-tea', '#Teaching', 'Teaching', 'RTVision3dFramework'),
      feat('f-poc', '#PositionCorrection', 'Position Correction', 'RTVision3dFramework', {
        optional: true,
      }),
    ],
  },
];

export const seedProducts: Product[] = [
  {
    id: 'TCVision.l',
    name: 'TCVision.l',
    description: 'Shell inspection (Liner)',
    categoryId: 'Software',
    licenses: [],
    features: '',
    meta: meta('p-tcl', 'Product'),
  },
  {
    id: 'TCVision.e',
    name: 'TCVision.e',
    description: 'End inspection',
    categoryId: 'Software',
    licenses: [],
    features: '',
    meta: meta('p-tce', 'Product'),
  },
  {
    id: 'RTVision',
    name: 'RTVision',
    description: 'Glue width inspection based in 2D-space',
    categoryId: 'Software',
    licenses: [{ id: '12.1234', name: 'Standard' }],
    features: '#ResultOverview;#PatchInspection',
    meta: meta('p-rtv', 'Product'),
  },
  {
    id: 'RTVision.3d',
    name: 'RTVision.3d',
    description: 'Complete glue evaluation in 3D-space',
    categoryId: 'Software',
    licenses: [
      { id: '12.10128', name: 'Standard' },
      { id: '12.10135', name: 'Advanced' },
      { id: '12.10140', name: 'Position Correction' },
    ],
    features: '#Teaching;#VolumeInspection;#PrimerInspection',
    meta: meta('p-rtv3d', 'Product'),
  },
];

export const seedLicenses: License[] = [
  {
    id: '12.1234',
    productId: 'RTVision',
    name: 'Standard',
    description: 'Standard license for RTVision product',
    features: ['#ResultOverview', '#PatchInspection'],
    meta: meta('l-rtv-std', 'License'),
  },
  {
    id: '12.10128',
    productId: 'RTVision.3d',
    name: 'Standard',
    description: 'Standard license for RTVision.3d product',
    features: ['#Teaching'],
    meta: meta('l-rtv3d-std', 'License'),
  },
  {
    id: '12.10135',
    productId: 'RTVision.3d',
    name: 'Advanced',
    description: 'Advanced license for RTVision.3d product',
    features: ['#Teaching', '#VolumeInspection'],
    meta: meta('l-rtv3d-adv', 'License'),
  },
  {
    id: '12.10140',
    productId: 'RTVision.3d',
    name: 'Position Correction',
    description: 'Standard + position correction license for RTVision.3d product',
    features: ['#Teaching', '#PositionCorrection'],
    meta: meta('l-rtv3d-pc', 'License'),
  },
];

export const seedAccounts: Account[] = [
  {
    id: 'imt-internal',
    name: 'ImagingTools (internal)',
    description: 'Internal demo account',
    type: 'company',
    ownerMail: 'admin@imagingtools.local',
    ownerFirstName: 'Admin',
    ownerLastName: 'Account',
  },
];

/**
 * Seed users with permissions tuned to mirror the QML authorization model.
 */
export const seedUsers: Array<{ password: string; user: SessionUser }> = [
  {
    password: 'admin',
    user: {
      id: 'u-admin',
      login: 'admin',
      displayName: 'Administrator',
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
        'Administration',
      ],
      lastConnection: ts,
    },
  },
  {
    password: 'view',
    user: {
      id: 'u-viewer',
      login: 'viewer',
      displayName: 'Read-only Viewer',
      permissions: ['ViewProducts', 'ViewLicenses', 'ViewFeatures'],
      lastConnection: ts,
    },
  },
];
