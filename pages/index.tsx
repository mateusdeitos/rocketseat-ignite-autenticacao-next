import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
//@ts-ignore
import styles from '../styles/Home.module.css';
import { withSSRGuest } from '../utils/withSSRGuest';

export default function Home() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const { signIn } = useAuth();
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

// withSSRGuest é uma High Order Function que irá redirecionar para o dashboard caso o user esteja logado
export const getServerSideProps: GetServerSideProps = withSSRGuest(async (ctx) => {
	return { props: { users: [] } }
})
