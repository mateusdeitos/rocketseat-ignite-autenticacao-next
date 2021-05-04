import { FormEvent, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
//@ts-ignore
import styles from '../styles/Home.module.css';

export default function Home() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const { isAuthenticated, signIn } = useAuth();
	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		signIn(formData);
	}
	return (
		<form onSubmit={handleSubmit} className={styles.container}>
			<input type="email" name="email" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
			<input type="password" name="password" id="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
			<button type="submit">Entrar</button>
		</form>
	)
}
