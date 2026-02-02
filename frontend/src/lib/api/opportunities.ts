import { apiRequest } from './config';

export interface OpportunityListing {
    id: string;
    title: string;
    host: string;
    badges: { text: string; style: string }[];
    summary: string;
    date: string;
    price: string;
    location: string;
    image: string;
    type: string;
}

export interface OpportunitiesResponse {
    count: number;
    results: OpportunityListing[];
}

export interface TagsResponse {
    tags: string[];
}

export interface TrendingTag {
    tag: string;
    count: number;
}

export interface PerfectMatch {
    title: string;
    match: string;
    tech: string;
}

export interface VertexConnect {
    context: string;
    avatars: string[];
    more_count: number;
}

export async function getOpportunitiesList(type: string, tags: string[] = []): Promise<OpportunitiesResponse> {
    const params = new URLSearchParams();
    params.append('type', type);
    tags.forEach(tag => params.append('tags', tag));

    return apiRequest<OpportunitiesResponse>(`/api/opportunities-list?${params.toString()}`);
}

export async function getTags(type: string): Promise<TagsResponse> {
    return apiRequest<TagsResponse>(`/api/tags/?type=${type}`);
}

export async function getTrending(type: string): Promise<TrendingTag[]> {
    return apiRequest<TrendingTag[]>(`/api/trending?type=${type}`);
}

export async function getPerfectMatch(type: string): Promise<PerfectMatch[]> {
    return apiRequest<PerfectMatch[]>(`/api/perfect-match?type=${type}`);
}

export async function getVertexConnect(type: string): Promise<VertexConnect[]> {
    return apiRequest<VertexConnect[]>(`/api/vertex-connect?type=${type}`);
}

export async function getOpportunityDetail(id: string): Promise<OpportunityListing | null> {
    // Currently no single-item endpoint, so fetch list and filter
    const response = await apiRequest<OpportunityListing[]>(`/api/opportunities/`);
    return response.find(opp => opp.id === id) || null;
}
