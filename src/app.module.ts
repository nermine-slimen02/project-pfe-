import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { CategoriesModule } from './categories/categories.module';
import { LocationsModule } from './locations/locations.module';
import { TeamsModule } from './teams/teams.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { InterventionsModule } from './interventions/interventions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommentsModule } from './comments/comments.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, TicketsModule, CategoriesModule, LocationsModule, TeamsModule, AssignmentsModule, InterventionsModule, NotificationsModule, DashboardModule, CommentsModule, AuditLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
