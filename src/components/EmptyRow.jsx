export default function EmptyRow() {
  return (
    <tr className="empty-row">
      <td colSpan={3} className="text-center text-muted">
        No categories yet. Add one to earn XP!
      </td>
    </tr>
  );
}
