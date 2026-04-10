import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export type ExecutionStatus = 'running' | 'completed' | 'failed';

export interface NodeTimelineEntry {
  nodeId: string;
  nodeName: string | null;
  nodeType: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE' | 'SKIPPED';
  startedAt: string;
  finishedAt?: string;
  output?: unknown;
  error?: string;
  httpStatus?: number;
}

interface WebFlowExecutionAttributes {
  id: number;
  webFlowId: number;
  userId: number;
  /** Set when run was triggered by WebFlowSchedule; null for manual runs. */
  scheduleId: number | null;
  status: ExecutionStatus;
  errorSummary: string | null;
  nodeTimeline: NodeTimelineEntry[];
  /** Final (or latest) variable pool keyed by Variable.id — mirrors client globalVariableStore. */
  variablePool: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WebFlowExecutionCreationAttributes
  extends Omit<WebFlowExecutionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'variablePool' | 'scheduleId'> {
  variablePool?: Record<string, unknown> | null;
  scheduleId?: number | null;
}

class WebFlowExecution
  extends Model<WebFlowExecutionAttributes, WebFlowExecutionCreationAttributes>
  implements WebFlowExecutionAttributes
{
  public id!: number;
  public webFlowId!: number;
  public userId!: number;
  public scheduleId!: number | null;
  public status!: ExecutionStatus;
  public errorSummary!: string | null;
  public nodeTimeline!: NodeTimelineEntry[];
  public variablePool!: Record<string, unknown> | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WebFlowExecution.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    webFlowId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'web_flows', key: 'id' },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'schedule_id',
      references: { model: 'web_flow_schedules', key: 'id' },
      onDelete: 'SET NULL',
    },
    status: {
      type: DataTypes.ENUM('running', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'running',
    },
    errorSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nodeTimeline: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    variablePool: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'WebFlowExecution',
    tableName: 'web_flow_executions',
    timestamps: true,
  }
);

export default WebFlowExecution;
