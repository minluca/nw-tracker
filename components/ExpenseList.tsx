export default function ExpenseList(
    { expenses, onDelete }: {
        expenses: { id: number, name: string, amount: number }[],
        onDelete: (id: number) => void
    }
){

return (
  <table>
    <tbody>
      {expenses.map((expense) => (
        <tr key={expense.id}>
          <td>{expense.name}</td>
          <td>{expense.amount}</td>
          <td>
            <button onClick={() => onDelete(expense.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
}
