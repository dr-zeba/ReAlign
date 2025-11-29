const conditions = [
  'Chronic back and neck pain',
  'Postural imbalance + biomechanical screening',
  'Sports injuries (ACL, rotator cuff, etc.)',
  'Neurological rehabilitation (stroke, post-polytherapy)',
  'Workplace ergonomics and prevention',
  'Post-surgical restoration (orthopedic/tendon repairs)',
  'Joint mobility and stiffness (shoulder, hip, knee)',
  'Movement re-education for older adults'
];

const conditionsList = document.getElementById('conditions-list');

if (conditionsList) {
  conditions.forEach((condition) => {
    const li = document.createElement('li');
    li.textContent = condition;
    conditionsList.appendChild(li);
  });
}
