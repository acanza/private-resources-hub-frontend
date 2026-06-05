import { apiRequest, addAuthorizationHeader } from './client';
import type {
  ResourcesResponse,
  DirectoryAccessResponse,
  DirectoryItemsResponse,
} from '../types/api';

/**
 * Fetch the list of available resources for the authenticated user.
 *
 * @param email - The authenticated user's email
 * @param idToken - The Cognito JWT token
 * @returns Promise containing the list of resources with access information
 */
export async function getResources(
  email: string,
  idToken: string | null
): Promise<ResourcesResponse> {
  const headers = addAuthorizationHeader({}, idToken);
  const path = `/resources?email=${encodeURIComponent(email)}`;

  return apiRequest<ResourcesResponse>('GET', path, {
    headers,
  });
}

/**
 * Request access to a private directory.
 * This endpoint validates the user's permission and sets CloudFront signed cookies.
 *
 * @param directoryName - The name of the directory to access
 * @param idToken - The Cognito JWT token
 * @returns Promise containing the CloudFront URL and expiration time
 */
export async function requestDirectoryAccess(
  directoryName: string,
  idToken: string | null
): Promise<DirectoryAccessResponse> {
  const headers = addAuthorizationHeader({}, idToken);

  return apiRequest<DirectoryAccessResponse>(
    'POST',
    `/resources/${directoryName}/access`,
    {
      headers,
      includeCredentials: true,
      body: {},
    }
  );
}

/**
 * Fetch the list of files in a private directory.
 * Must be called after requestDirectoryAccess succeeds.
 *
 * @param directoryName - The name of the directory
 * @param email - The authenticated user's email
 * @param idToken - The Cognito JWT token
 * @returns Promise containing the list of files with signed URLs
 */
export async function getDirectoryItems(
  directoryName: string,
  email: string,
  idToken: string | null
): Promise<DirectoryItemsResponse> {
  const headers = addAuthorizationHeader({}, idToken);
  const path = `/resources/${directoryName}?email=${encodeURIComponent(email)}`;

  return apiRequest<DirectoryItemsResponse>(
    'GET',
    path,
    {
      headers,
    }
  );
}
