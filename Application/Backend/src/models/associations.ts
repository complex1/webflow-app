import User from './User';
import EnvFile from './EnvFile';
import EnvConfig from './EnvConfig';
import WebFlow from './WebFlow';
import WebFlowEnvFile from './WebFlowEnvFile';
import WebFlowConfig from './WebFlowConfig';
import WebFlowExecution from './WebFlowExecution';
import WebFlowSchedule from './WebFlowSchedule';
import File from './File';

// Define all model associations here to avoid circular dependencies

// User associations
User.hasMany(EnvFile, { foreignKey: 'userId', as: 'envFiles' });
User.hasMany(WebFlow, { foreignKey: 'userId', as: 'webFlows' });
User.hasMany(WebFlowConfig, { foreignKey: 'userId', as: 'webFlowConfigs' });
User.hasMany(WebFlowExecution, { foreignKey: 'userId', as: 'webFlowExecutions' });
User.hasMany(WebFlowSchedule, { foreignKey: 'userId', as: 'webFlowSchedules' });
User.hasMany(File, { foreignKey: 'userId', as: 'files' });

// EnvFile associations
EnvFile.belongsTo(User, { foreignKey: 'userId', as: 'user' });
EnvFile.hasMany(EnvConfig, { foreignKey: 'envFileId', as: 'configs' });
EnvFile.belongsToMany(WebFlow, { 
  through: WebFlowEnvFile, 
  foreignKey: 'envFileId', 
  otherKey: 'webFlowId',
  as: 'webFlows' 
});

// EnvConfig associations
EnvConfig.belongsTo(EnvFile, { foreignKey: 'envFileId', as: 'envFile' });

// WebFlow associations
WebFlow.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WebFlow.hasOne(WebFlowConfig, { foreignKey: 'webFlowId', as: 'config' });
WebFlow.hasMany(WebFlowExecution, { foreignKey: 'webFlowId', as: 'executions' });
WebFlow.hasMany(WebFlowSchedule, { foreignKey: 'webFlowId', as: 'schedules' });
WebFlow.belongsToMany(EnvFile, { 
  through: WebFlowEnvFile, 
  foreignKey: 'webFlowId', 
  otherKey: 'envFileId',
  as: 'envFiles' 
});

// Self-referencing associations for folder structure
WebFlow.hasMany(WebFlow, { foreignKey: 'parentId', as: 'children' });
WebFlow.belongsTo(WebFlow, { foreignKey: 'parentId', as: 'parent' });

// WebFlowConfig associations
WebFlowConfig.belongsTo(WebFlow, { foreignKey: 'webFlowId', as: 'webFlow' });
WebFlowConfig.belongsTo(User, { foreignKey: 'userId', as: 'user' });

WebFlowExecution.belongsTo(WebFlow, { foreignKey: 'webFlowId', as: 'webFlow' });
WebFlowExecution.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WebFlowExecution.belongsTo(WebFlowSchedule, { foreignKey: 'scheduleId', as: 'schedule' });
WebFlowSchedule.belongsTo(WebFlow, { foreignKey: 'webFlowId', as: 'webFlow' });
WebFlowSchedule.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WebFlowSchedule.belongsTo(EnvFile, { foreignKey: 'envFileId', as: 'envFile' });
WebFlowSchedule.hasMany(WebFlowExecution, { foreignKey: 'scheduleId', as: 'executions' });

// WebFlowEnvFile associations (junction table)
WebFlowEnvFile.belongsTo(WebFlow, { foreignKey: 'webFlowId', as: 'webFlow' });
WebFlowEnvFile.belongsTo(EnvFile, { foreignKey: 'envFileId', as: 'envFile' });
User.hasMany(WebFlowEnvFile, { foreignKey: 'userId', as: 'webFlowEnvFiles' });
WebFlowEnvFile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// File associations
File.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WebFlow.hasMany(File, { foreignKey: 'webFlowId', as: 'files' });
File.belongsTo(WebFlow, { foreignKey: 'webFlowId', as: 'webFlow' });

export {
  User,
  EnvFile,
  EnvConfig,
  WebFlow,
  WebFlowConfig,
  WebFlowExecution,
  WebFlowSchedule,
  WebFlowEnvFile,
  File
};
