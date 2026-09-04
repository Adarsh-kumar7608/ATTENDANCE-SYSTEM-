import { useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState("");
  const [search, setSearch] = useState("");

  const saveStudents = (data) => {
    setStudents(data);
    localStorage.setItem("students", JSON.stringify(data));
  };

  const addStudent = () => {
    if (!name || !rollNo || !branch) {
      alert("Please fill all fields");
      return;
    }

    const newStudent = {
      id: Date.now(),
      name,
      rollNo,
      branch,
      present: 0,
      total: 0,
    };

    saveStudents([...students, newStudent]);

    setName("");
    setRollNo("");
    setBranch("");
  };

  const markAttendance = (id, status) => {
    const updated = students.map((student) => {
      if (student.id === id) {
        return {
          ...student,
          present:
            status === "Present"
              ? student.present + 1
              : student.present,
          total: student.total + 1,
        };
      }

      return student;
    });

    saveStudents(updated);
  };

  const deleteStudent = (id) => {
    const updated = students.filter((student) => student.id !== id);
    saveStudents(updated);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.rollNo.includes(search)
  );

  const totalStudents = students.length;

  return (
    <div className="app">

      <header>
        <h1>🎓 Student Attendance System</h1>
        <p>Manage student attendance easily</p>
      </header>

      <div className="dashboard">

        <div className="card">
          <h3>Total Students</h3>
          <h2>{totalStudents}</h2>
        </div>

        <div className="card">
          <h3>Today's Attendance</h3>
          <h2>
            {students.filter((s) => s.total > 0).length}
          </h2>
        </div>

        <div className="card">
          <h3>Present</h3>
          <h2>
            {students.reduce((sum, s) => sum + s.present, 0)}
          </h2>
        </div>

      </div>

      <section className="form-section">

        <h2>Add Student</h2>

        <div className="form">

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />

          <input
            type="text"
            placeholder="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />

          <button onClick={addStudent}>
            + Add Student
          </button>

        </div>

      </section>

      <section className="student-section">

        <div className="top-bar">
          <h2>Student List</h2>

          <input
            className="search"
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Attendance</th>
                <th>Mark Attendance</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.map((student) => {

                const percentage =
                  student.total === 0
                    ? 0
                    : Math.round(
                        (student.present / student.total) * 100
                      );

                return (
                  <tr key={student.id}>

                    <td>{student.rollNo}</td>

                    <td>{student.name}</td>

                    <td>{student.branch}</td>

                    <td>
                      <strong>{percentage}%</strong>
                    </td>

                    <td>

                      <button
                        className="present"
                        onClick={() =>
                          markAttendance(student.id, "Present")
                        }
                      >
                        Present
                      </button>

                      <button
                        className="absent"
                        onClick={() =>
                          markAttendance(student.id, "Absent")
                        }
                      >
                        Absent
                      </button>

                    </td>

                    <td>

                      <button
                        className="delete"
                        onClick={() =>
                          deleteStudent(student.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

          {students.length === 0 && (
            <p className="empty">
              No students added yet.
            </p>
          )}

        </div>

      </section>

    </div>
  );
}

export default App;