export declare class CreateCvDto {
    title: string;
    slug?: string;
    template?: 'CLASSIC' | 'MODERN' | 'COMPACT';
    theme?: any;
    data?: any;
}
export declare class UpdateCvDto {
    title?: string;
    slug?: string;
    template?: 'CLASSIC' | 'MODERN' | 'COMPACT';
    theme?: any;
    data?: any;
    isPublic?: boolean;
}
