package wlcp.model.master.state;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.*;

import wlcp.model.master.transition.SingleButtonPress;

/**
 * Entity implementation class for Entity: PictureOutputState
 *
 */
@Embeddable
public class PictureOutput implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	
	@Column(name = "URL")
	private String url;
	
	@Column(name = "SCALE")
	private Integer scale;
	
	public PictureOutput() {
		super();
	}

	public PictureOutput(String url, Integer scale) {
		super();
		this.url = url;
		this.scale = scale;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Integer getScale() {
		return scale;
	}

	public void setScale(Integer scale) {
		this.scale = scale;
	}
	
	
   
}