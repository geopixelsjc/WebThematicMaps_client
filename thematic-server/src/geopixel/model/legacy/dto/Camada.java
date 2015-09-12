package geopixel.model.legacy.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * Model class of app_camada.
 * 
 * @author generated by ERMaster
 * @version $Id$
 */
public class Camada implements Serializable {

	/** serialVersionUID. */
	private static final long serialVersionUID = 1L;

	/** cmd_id. */
	private Integer cmdId;

	/** nome. */
	private String nome;

	/** nome_tabela_geo. */
	private String nomeTabelaGeo;

	/** fonte_dado. */
	private String fonteDado;

	/** The set of app_tema. */
	private Set<Tema> appTemaSet;

	/**
	 * Constructor.
	 */
	public Camada() {
		this.appTemaSet = new HashSet<Tema>();
	}

	/**
	 * Set the cmd_id.
	 * 
	 * @param cmdId
	 *            cmd_id
	 */
	public void setCmdId(Integer cmdId) {
		this.cmdId = cmdId;
	}

	/**
	 * Get the cmd_id.
	 * 
	 * @return cmd_id
	 */
	public Integer getCmdId() {
		return this.cmdId;
	}

	/**
	 * Set the nome.
	 * 
	 * @param nome
	 *            nome
	 */
	public void setNome(String nome) {
		this.nome = nome;
	}

	/**
	 * Get the nome.
	 * 
	 * @return nome
	 */
	public String getNome() {
		return this.nome;
	}

	/**
	 * Set the nome_tabela_geo.
	 * 
	 * @param nomeTabelaGeo
	 *            nome_tabela_geo
	 */
	public void setNomeTabelaGeo(String nomeTabelaGeo) {
		this.nomeTabelaGeo = nomeTabelaGeo;
	}

	/**
	 * Get the nome_tabela_geo.
	 * 
	 * @return nome_tabela_geo
	 */
	public String getNomeTabelaGeo() {
		return this.nomeTabelaGeo;
	}

	/**
	 * Set the fonte_dado.
	 * 
	 * @param fonteDado
	 *            fonte_dado
	 */
	public void setFonteDado(String fonteDado) {
		this.fonteDado = fonteDado;
	}

	/**
	 * Get the fonte_dado.
	 * 
	 * @return fonte_dado
	 */
	public String getFonteDado() {
		return this.fonteDado;
	}

	/**
	 * Set the set of the app_tema.
	 * 
	 * @param appTemaSet
	 *            The set of app_tema
	 */
	public void setTemaSet(Set<Tema> appTemaSet) {
		this.appTemaSet = appTemaSet;
	}

	/**
	 * Add the app_tema.
	 * 
	 * @param appTema
	 *            app_tema
	 */
	public void addTema(Tema appTema) {
		this.appTemaSet.add(appTema);
	}

	/**
	 * Get the set of the app_tema.
	 * 
	 * @return The set of app_tema
	 */
	public Set<Tema> getTemaSet() {
		return this.appTemaSet;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cmdId == null) ? 0 : cmdId.hashCode());
		return result;
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		Camada other = (Camada) obj;
		if (cmdId == null) {
			if (other.cmdId != null) {
				return false;
			}
		} else if (!cmdId.equals(other.cmdId)) {
			return false;
		}
		return true;
	}

}