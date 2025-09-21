import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCvDto, UpdateCvDto } from './dto/cv.dto';

@Injectable()
export class CvsService {
  constructor(private readonly database: DatabaseService) {}

  async findAllByUser(userId: string) {
    const cvs = await this.database.findCVsByUserId(userId);
    
    // Get the latest version for each CV
    const cvsWithVersions = await Promise.all(
      cvs.map(async (cv) => {
        const versions = await this.database.findVersionsByCVId(cv.id!);
        const latestVersion = versions.length > 0 ? versions[0] : null;
        
        return {
          id: cv.id,
          title: cv.title,
          slug: cv.slug,
          isPublic: cv.isPublic,
          template: cv.template,
          createdAt: cv.createdAt,
          updatedAt: cv.updatedAt,
          versions: latestVersion ? [{ id: latestVersion.id, createdAt: latestVersion.createdAt }] : [],
        };
      })
    );
    
    // Sort by updatedAt descending
    return cvsWithVersions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async findOne(id: string, userId: string) {
    const cv = await this.database.findCVById(id);

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    if (cv.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Get versions for this CV
    const versions = await this.database.findVersionsByCVId(id);
    const versionsWithLabels = versions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(version => ({
        id: version.id,
        label: version.label,
        createdAt: version.createdAt,
      }));

    return {
      ...cv,
      versions: versionsWithLabels,
    };
  }

  async create(userId: string, createCvDto: CreateCvDto) {
    const slug = createCvDto.slug || this.generateSlug(createCvDto.title);

    const cv = await this.database.createCV({
      userId,
      title: createCvDto.title,
      slug,
      template: (createCvDto.template as any) || 'CLASSIC',
      isPublic: false,
      theme: createCvDto.theme || {
        fontFamily: 'Inter',
        accentColor: '#3b82f6',
        spacing: 'normal',
        showIcons: true,
        compactMode: false,
      },
      data: createCvDto.data || {
        header: {
          fullName: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          github: '',
          linkedin: '',
          avatarUrl: '',
          summaryRichText: '',
        },
        experience: [],
        education: [],
        projects: [],
        skills: { groups: [] },
        certifications: [],
        languages: [],
        interests: [],
        customSections: [],
      },
    });

    // Create initial version
    await this.database.createVersion({
      cvId: cv.id!,
      label: 'Initial version',
      snapshot: {
        template: cv.template,
        theme: cv.theme,
        data: cv.data,
      },
    });

    return cv;
  }

  async update(id: string, userId: string, updateCvDto: UpdateCvDto) {
    await this.findOne(id, userId);

    const updatedCv = await this.database.updateCV(id, {
      ...(updateCvDto as any),
      updatedAt: new Date(),
    });

    return updatedCv;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    const deleted = await this.database.deleteCV(id);

    if (!deleted) {
      throw new NotFoundException('CV not found');
    }

    return { message: 'CV deleted successfully' };
  }

  async duplicate(id: string, userId: string) {
    const originalCv = await this.findOne(id, userId);

    const newCv = await this.database.createCV({
      userId,
      title: `${originalCv.title} (Copy)`,
      slug: `${originalCv.slug}-copy-${Date.now()}`,
      template: originalCv.template,
      isPublic: false,
      theme: originalCv.theme,
      data: originalCv.data as any,
    });

    // Create initial version for duplicated CV
    await this.database.createVersion({
      cvId: newCv.id!,
      label: 'Duplicated version',
      snapshot: {
        template: newCv.template,
        theme: newCv.theme,
        data: newCv.data,
      },
    });

    return newCv;
  }

  async updateVisibility(id: string, userId: string, isPublic: boolean) {
    await this.findOne(id, userId);

    return this.database.updateCV(id, { isPublic });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}