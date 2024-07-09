export const BUCKET_LOGS = process.env.BUCKET_LOGS || '';

export const BUCKET_EDGES = process.env.BUCKET_EDGES || '';
export const BUCKET_REVERSE_EDGES = process.env.BUCKET_REVERSE_EDGES || '';
export const BUCKET_NODES = process.env.BUCKET_NODES || '';
export const BUCKET_OWNERS = process.env.BUCKET_OWNERS || '';
export const BUCKET_RIGHTS_ADMIN = process.env.BUCKET_RIGHTS_ADMIN || '';
export const BUCKET_RIGHTS_READ = process.env.BUCKET_RIGHTS_READ || '';
export const BUCKET_RIGHTS_WRITE = process.env.BUCKET_RIGHTS_WRITE || '';

export const BUCKET_MEDIA = process.env.BUCKET_MEDIA || '';

export const EFS_MOUNT = '/mnt/efs';
export const DIR_NODES = `${EFS_MOUNT}/nodes`;
export const DIR_EDGES = `${EFS_MOUNT}/edges`;
export const DIR_REVERSE_EDGES = `${EFS_MOUNT}/reverse-edges`;
export const DIR_RIGHTS_READ = `${EFS_MOUNT}/rights-read`;
export const DIR_RIGHTS_WRITE = `${EFS_MOUNT}/rights-write`;
export const DIR_RIGHTS_ADMIN = `${EFS_MOUNT}/rights-admin`;
export const DIR_OWNERS = `${EFS_MOUNT}/owners`;
export const DIR_MEDIA = `${EFS_MOUNT}/media`;
export const DIR_LOGS = `${EFS_MOUNT}/logs`;

export const PrincipalType = {
    USER: 'user',
    ROLE: 'role',
};
