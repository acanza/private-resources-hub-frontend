export type Resource = {
  name: string;
  has_access: boolean;
  access_url: string | null;
};

export type ResourcesResponse = {
  resources: Resource[];
};

export type DirectoryAccessResponse = {
  cloudfront_url: string;
  expires_at: number;
};

export type DirectoryItem = {
  name: string;
  signed_url: string;
};

export type DirectoryItemsResponse = {
  items: DirectoryItem[];
};

export type AuthError = {
  code?: string;
  message: string;
};
