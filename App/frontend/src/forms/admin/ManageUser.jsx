import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const manageUserSchema = z.object({
  userId: z.string().min(1, "Select a user."),
  action: z.enum(["activate", "deactivate", "delete"], { error: "Select an action." }),
  reason: z.string().max(500, "Reason must be at most 500 characters."),
});

function ManageUser({ users = [] }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(manageUserSchema) });
  const onSubmit = (event) => {
    event.stopPropagation();
    void handleSubmit((_data, submitEvent) => {
      submitEvent?.target.dispatchEvent(new Event("validatedsubmit", { bubbles: true, cancelable: true }));
    })(event);
  };

  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form data-form-type="manage-user" noValidate onSubmit={onSubmit}>
          <h1>Manage User</h1>

          <label htmlFor="managed-user">Select User</label>
          <select id="managed-user" defaultValue="" required {...register("userId")}>
            <option value="" disabled>Select User</option>
            {users.filter((user) => user.role !== "admin").map((user) => (
              <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
            ))}
          </select>
          {errors.userId && <span className="form-field-error" role="alert">{errors.userId.message}</span>}

          <label htmlFor="user-action">Action</label>
          <select id="user-action" defaultValue="" required {...register("action")}>
            <option value="" disabled>Select Action</option>
            <option value="activate">Activate User</option>
            <option value="deactivate">Deactivate User</option>
            <option value="delete">Delete User</option>
          </select>
          {errors.action && <span className="form-field-error" role="alert">{errors.action.message}</span>}

          <label htmlFor="user-reason">Reason</label>
          <textarea id="user-reason" maxLength="500" placeholder="Enter reason" {...register("reason")}></textarea>
          {errors.reason && <span className="form-field-error" role="alert">{errors.reason.message}</span>}

          <button type="submit">Apply Action</button>
        </form>

      </div>
    </div>
  );
}

export default ManageUser;