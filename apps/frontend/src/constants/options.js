export const priorityOptions = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
  { label: 'Urgent', value: 'Urgent' },
];

export const statusOptions = [
  { label: 'Backlog', value: 'Backlog' },
  { label: 'Unstarted', value: 'Unstarted' },
  { label: 'Started', value: 'Started' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Canceled', value: 'Canceled' },
];

export const filterPriorityOptions = [{ label: 'All Priority', value: '' }, ...priorityOptions];

export const filterStatusOptions = [{ label: 'All Status', value: '' }, ...statusOptions];

export const sortOptions = [
  { label: 'Most recent first', value: 'desc' },
  { label: 'Oldest first', value: 'asc' },
];
